import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "react-native-size-matters";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Audio } from "expo-av";
import axios from "axios";
import LottieView from "lottie-react-native";
import * as Speech from "expo-speech";
import Regenerate from "@/assets/svgs/regenerate";
import Reload from "@/assets/svgs/reload";

const HomeScreen = () => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording>();
  const [loading, setLoading] = useState(false);
  const [AIResponse, setAIResponse] = useState(false);
  const [AISpeaking, setAISpeaking] = useState(false);
  const lottieRef = useRef<LottieView>(null);

  const getMicroPhonePermission = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();

      if (!granted) {
        Alert.alert("許可", "マイクへのアクセス許可を付与してください");
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const recordingOptions: any = {
    android: {
      extension: ".wav",
      outPutFormat: Audio.AndroidOutputFormat.MPEG_4,
      androidEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".wav",
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  const startRecording = async () => {
    const hasPermission = await getMicroPhonePermission();
    if (!hasPermission) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setIsRecording(true);

      const { recording } = await Audio.Recording.createAsync(recordingOptions);

      setRecording(recording);
    } catch (error) {
      console.log("録音に失敗しました", error);
      Alert.alert("エラー", "録音に失敗しました");
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setLoading(true);

      await recording?.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording?.getURI();

      const transcription = await sendAudioToWhisper(uri!);

      setText(transcription);
      await sendToGpt(transcription);
    } catch (error) {
      console.log("録音停止に失敗しました", error);
      Alert.alert("エラー", "録音停止に失敗しました");
    }
  };

  const sendAudioToWhisper = async (uri: string) => {
    try {
      const formData: any = new FormData();

      formData.append("file", {
        uri,
        type: "audio/wav",
        name: "recording.wav",
      });

      formData.append("model", "whisper-1");

      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.text;
    } catch (error) {
      console.log(error);
    }
  };

  const sendToGpt = async (text: string) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "あなたはArtifonia、自然な応答をするフレンドリーなAIアシスタントです。名前を聞かれたらArtifoniaと名乗ってください。質問に答えたり、タスクを支援したりする役に立つアシスタントです。入力言語に関係なく、常に日本語で回答し、有益で明確な回答を提供しなければなりません。",
            },
            {
              role: "user",
              content: text,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      setText(response.data.choices[0].message.content);
      setLoading(false);
      setAIResponse(true);
      await speakText(response.data.choices[0].message.content);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.log(error);
    }
  };

  const speakText = async (text: string) => {
    setAISpeaking(true);
    const options = {
      voice: "com.apple.ttsbundle.Samantha-compact",
      language: "en-US",
      pitch: 1.5,
      rate: 1,
      onDone: () => {
        setAISpeaking(false);
      },
    };
    Speech.speak(text, options);
  };

  useEffect(() => {
    if (AISpeaking) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.reset();
    }
  }, [AISpeaking]);

  return (
    <LinearGradient
      colors={["#250152", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle={"light-content"} />

      {/* back shadows */}
      <Image
        source={require("@/assets/main/blur.png")}
        style={{
          position: "absolute",
          right: scale(-15),
          top: 0,
          width: scale(240),
        }}
      />
      <Image
        source={require("@/assets/main/purple-blur.png")}
        style={{
          position: "absolute",
          left: scale(-15),
          bottom: verticalScale(100),
          width: scale(210),
        }}
      />

      {/* Back arrow */}
      {AIResponse && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: verticalScale(50),
            left: scale(20),
          }}
          onPress={() => {
            setIsRecording(false);
            setAIResponse(false);
            setText("");
          }}
        >
          <AntDesign name="arrowleft" size={scale(20)} color="#fff" />
        </TouchableOpacity>
      )}

      <View style={{ marginTop: verticalScale(-40) }}>
        {loading ? (
          <TouchableOpacity>
            <LottieView
              source={require("@/assets/animations/loading.json")}
              autoPlay
              loop
              speed={1.3}
              style={{ width: scale(270), height: scale(270) }}
            />
          </TouchableOpacity>
        ) : (
          <>
            {!isRecording ? (
              <>
                {AIResponse ? (
                  <View>
                    <LottieView
                      ref={lottieRef}
                      source={require("@/assets/animations/ai-speaking.json")}
                      autoPlay={false}
                      loop={false}
                      style={{ width: scale(250), height: scale(250) }}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      width: scale(110),
                      height: scale(110),
                      backgroundColor: "#fff",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: scale(100),
                    }}
                    onPress={startRecording}
                  >
                    <FontAwesome
                      name="microphone"
                      size={scale(50)}
                      color="#2b3356"
                    />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity onPress={stopRecording}>
                <LottieView
                  source={require("@/assets/animations/animation.json")}
                  autoPlay
                  loop
                  speed={1.3}
                  style={{ width: scale(250), height: scale(250) }}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      <View
        style={{
          alignItems: "center",
          width: scale(350),
          position: "absolute",
          bottom: verticalScale(90),
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: scale(16),
            width: scale(269),
            textAlign: "center",
            lineHeight: 25,
          }}
        >
          {loading ? "..." : text || "Press the microphone to start recording!"}
        </Text>
      </View>
      {AIResponse && (
        <View
          style={{
            position: "absolute",
            bottom: verticalScale(40),
            left: 0,
            paddingHorizontal: scale(30),
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: scale(360),
          }}
        >
          <TouchableOpacity onPress={() => sendToGpt(text)}>
            <Regenerate />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => speakText(text)}>
            <Reload />
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#131313",
  },
});
