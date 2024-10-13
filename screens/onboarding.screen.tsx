import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { onBoardingData } from "@/configs/constants";
import { scale, verticalScale } from "react-native-size-matters";
import { useFonts } from "expo-font";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const OnBoardingScreen = () => {
  let [fontsLoaded, fontError] = useFonts({
    SegoeUI: require("../assets/fonts/Segoe-UI.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(
      contentOffsetX / event.nativeEvent.layoutMeasurement.width
    );
    setActiveIndex(currentIndex);
  };

  const handleSkip = async () => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < onBoardingData.length) {
      scrollViewRef.current?.scrollTo({
        x: Dimensions.get("window").width * nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    } else {
      await AsyncStorage.setItem("onBoarding", "true");
      router.push("/(routes)/home");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#250152", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <Pressable style={styles.skipContainer} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
          <AntDesign name="arrowright" size={scale(18)} color="white" />
        </Pressable>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
        >
          {onBoardingData.map((item: onBoardingDataType, index: number) => (
            <View key={index} style={styles.slide}>
              <View style={styles.imageContainer}>{item.image}</View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.paginationContainer}>
          {onBoardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: activeIndex === index ? 1 : 0.3,
                },
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#250152",
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  slide: {
    width: Dimensions.get("window").width,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(40),
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(60),
  },
  title: {
    color: "#fff",
    fontSize: scale(22),
    fontFamily: "SegoeUI",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: verticalScale(15),
  },
  subtitle: {
    width: scale(290),
    color: "#9A9999",
    fontSize: scale(14),
    fontFamily: "SegoeUI",
    textAlign: "center",
    fontWeight: "400",
  },
  paginationContainer: {
    position: "absolute",
    bottom: verticalScale(20),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(8),
  },
  dot: {
    width: scale(8),
    height: scale(8),
    borderRadius: 100,
    backgroundColor: "#fff",
    marginHorizontal: scale(2),
  },
  skipContainer: {
    position: "absolute",
    top: verticalScale(40),
    right: scale(20),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    zIndex: 100,
  },
  skipText: {
    color: "#fff",
    fontSize: scale(16),
    fontFamily: "SegoeUI",
    fontWeight: "400",
  },
});
