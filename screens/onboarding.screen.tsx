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
  return (
    <View>
      <Text>OnBoardingScreen</Text>
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({});
