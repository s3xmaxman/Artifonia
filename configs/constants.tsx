import OnBoarding1 from "@/assets/svgs/onboarding1";
import OnBoarding2 from "@/assets/svgs/onboarding2";
import OnBoarding3 from "@/assets/svgs/onboarding3";

export const onBoardingData: onBoardingDataType[] = [
  {
    id: 1,
    title: "AIコンパニオンとの出会い",
    subtitle:
      "インタラクティブなAI会話を通じて、コミュニケーションと知識の未来を発見しましょう。",
    image: <OnBoarding1 />,
  },
  {
    id: 2,
    title: "質問、学習、進化",
    subtitle:
      "AIと交流し、質問し、リアルタイムで成長を助ける洞察を得ましょう。",
    image: <OnBoarding2 />,
  },
  {
    id: 3,
    title: "あなたの人生を探求する",
    subtitle:
      "あなたのユニークなニーズに合わせたAI体験をカスタマイズし、いつでもパーソナライズされた回答を得ましょう。",
    image: <OnBoarding3 />,
  },
];
