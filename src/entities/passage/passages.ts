import type { Passage } from "./types";

const dadVideoCall: Passage = {
  id: "dad-video-call",
  title: "My Dad Learns to Video Call",
  titleKo: "우리 아빠, 영상통화를 배우다",
  category: "Story",
  level: "Easy",
  minutes: 2,
  available: true,
  paragraphsEn: [
  "My dad is sixty-three, and last month he finally got a smartphone. My sister and I were excited. We imagined long video calls where he would tell us about his day.",
  "His first call came at seven in the morning. I answered, half asleep, and saw only a [[blurry]] ceiling light. \"Hello? Can you see me?\" he shouted. \"I can see your ceiling, Dad,\" I said. \"Turn the phone around.\" The screen spun and showed his left ear, then his forehead, then a very close view of his nose. I laughed so hard that I woke up completely.",
  "Over the next week, we gave him lessons. My sister explained which button flips the camera. I wrote a list in big letters and taped it to the back of his phone. He nodded seriously, like a student before an exam.",
  "Last Sunday, he called again. This time I saw his whole face, a little tired but smiling. Behind him, my mom waved and held up a plate of dumplings. \"Look, we made lunch!\" he said proudly. Then he turned the camera around to show me the kitchen, and the phone slipped. All I saw was the floor and the dog's tail.",
  "Still, I wasn't annoyed. I was just happy that he called, and I'm already looking forward to the next time."
],
  paragraphsKo: [
  "우리 아빠는 63세인데, 지난달에 드디어 스마트폰을 장만하셨다. 여동생과 나는 신이 났다. 아빠가 하루 있었던 일을 들려주는 긴 영상통화를 상상했다.",
  "아빠의 첫 전화는 아침 7시에 왔다. 반쯤 잠든 채로 받았더니 흐릿한 천장 조명만 보였다. \"여보세요? 내가 보이니?\" 아빠가 소리쳤다. \"천장만 보여요, 아빠.\" 내가 말했다. \"폰을 돌려 보세요.\" 화면이 빙글 돌더니 아빠의 왼쪽 귀, 이마, 그리고 코가 아주 가까이 나타났다. 나는 너무 웃어서 잠이 완전히 깼다.",
  "다음 한 주 동안 우리는 아빠에게 수업을 해 드렸다. 동생은 카메라를 전환하는 버튼이 어디인지 알려 드렸다. 나는 큰 글씨로 설명서를 써서 폰 뒷면에 붙여 드렸다. 아빠는 시험 앞둔 학생처럼 진지하게 고개를 끄덕이셨다.",
  "지난 일요일에 아빠가 다시 전화하셨다. 이번에는 아빠의 얼굴 전체가 보였고, 조금 피곤해 보였지만 웃고 계셨다. 뒤에서 엄마가 손을 흔들며 만두 한 접시를 들어 보이셨다. \"봐라, 우리가 점심 만들었어!\" 아빠가 자랑스럽게 말했다. 그러더니 부엌을 보여 주려고 카메라를 돌리다가 폰이 미끄러졌다. 내 눈에는 바닥과 강아지 꼬리만 보였다.",
  "그래도 짜증 나지는 않았다. 아빠가 전화해 줘서 그저 행복했고, 벌써 다음 통화가 기다려진다."
],
  vocab: { blurry: "흐릿한" },
  talk: [
    { id: "t1", kind: "의견", text: "Why do you think the writer wasn't annoyed, even when the call went wrong?" },
    { id: "t2", kind: "경험", text: "Have you ever helped a family member or friend learn new technology? What was it like?" },
    { id: "t3", kind: "의견", text: "Do you think video calls are better than phone calls? Why or why not?" },
    { id: "t4", kind: "경험", text: "Do you have a funny story about a phone call or a video call?" },
    { id: "t5", kind: "의견", text: "Which technology is the hardest for you to use? Why?" },
  ],
  expressions: [
    {
      id: "e1",
      phrase: "half asleep",
      meaningKo: "반쯤 잠든",
      sourceEn: "I answered, **half asleep**, and saw only a blurry ceiling light.",
      sourceKo: "반쯤 잠든 채로 받았더니 흐릿한 천장 조명만 보였다.",
      examples: [
        { ko: "회의 중에 반쯤 졸고 있었어요.", blank: { before: "I was", after: "during the meeting.", answer: "half asleep" } },
        { ko: "그는 아침 일곱 시에 반쯤 잠든 채로 전화를 받았다.", en: "He answered the phone **half asleep** at seven in the morning." },
        { ko: "나는 반쯤 잠든 채로 아침을 만들었다.", en: "I made breakfast **half asleep**." },
      ],
    },
    {
      id: "e2",
      phrase: "laughed so hard",
      meaningKo: "너무 웃어서 ~할 정도로 웃다",
      sourceEn: "I **laughed so hard** that I woke up completely.",
      sourceKo: "너무 크게 웃어서 잠이 확 깼다.",
      examples: [
        { ko: "나는 너무 웃어서 눈물이 났다.", blank: { before: "I", after: "that I cried.", answer: "laughed so hard" } },
        { ko: "우리는 그 영상을 보고 배가 아플 정도로 웃었다.", en: "We **laughed so hard** at the video that our stomachs hurt." },
        { ko: "그는 너무 웃어서 말을 끝내지 못했다.", en: "He **laughed so hard** that he couldn't finish his sentence." },
      ],
    },
    {
      id: "e3",
      phrase: "looking forward to",
      meaningKo: "~을 기대하다",
      sourceEn: "I'm already **looking forward to** the next time.",
      sourceKo: "벌써 다음번이 기대된다.",
      examples: [
        { ko: "다음 주 여행이 정말 기대돼요.", blank: { before: "I'm really", after: "next week's trip.", answer: "looking forward to" } },
        { ko: "다음 모임에서 여러분을 만나기를 기대하고 있어요.", en: "I'm **looking forward to** seeing you all at the next meeting." },
        { ko: "아이들은 여름방학을 몹시 기다리고 있다.", en: "The kids are **looking forward to** summer vacation." },
      ],
    },
  ],
  practice: [
    { id: "p1", ko: "아빠의 첫 영상통화를 받았을 때 글쓴이는 어떤 상태였나요?", hint: { phrase: "half asleep", meaningKo: "반쯤 잠든" }, model: "I was half asleep when Dad called me at seven in the morning." },
    { id: "p2", ko: "글쓴이가 첫 통화에서 크게 웃은 이유는 무엇인가요?", hint: { phrase: "laughed so hard", meaningKo: "너무 웃어서 ~할 정도로 웃다" }, model: "I laughed so hard when the screen showed my dad's nose." },
    { id: "p3", ko: "글쓴이는 다음 영상통화를 어떻게 생각하나요?", hint: { phrase: "looking forward to", meaningKo: "~을 기대하다" }, model: "I'm looking forward to the next video call with my dad." },
    { id: "p4", ko: "글쓴이는 아빠의 전화를 받을 때 보통 어떤 기분이었나요?", hint: { phrase: "looking forward to", meaningKo: "~을 기대하다" }, model: "I was always looking forward to his calls." },
    { id: "p5", ko: "아빠가 카메라를 엉뚱하게 돌렸을 때 글쓴이는 어떻게 반응했나요?", hint: { phrase: "laughed so hard", meaningKo: "너무 웃어서 ~할 정도로 웃다" }, model: "I laughed so hard that I couldn't answer him." },
  ],
  write: [
    { id: "w1", ko: "나는 그 농담이 너무 웃겨서 숨을 쉴 수 없었다.", hint: { phrase: "laughed so hard", meaningKo: "너무 웃어서 ~할 정도로 웃다" } },
    { id: "w2", ko: "우리 아빠는 다음 영상통화를 기대하고 계신다.", hint: { phrase: "looking forward to", meaningKo: "~을 기대하다" } },
    { id: "w3", ko: "동생은 반쯤 잠든 채로 학교에 갔다.", hint: { phrase: "half asleep", meaningKo: "반쯤 잠든" } },
    { id: "w4", ko: "그녀는 너무 웃어서 말을 잇지 못했다.", hint: { phrase: "laughed so hard", meaningKo: "너무 웃어서 ~할 정도로 웃다" } },
    { id: "w5", ko: "나는 주말에 친구들을 만나기를 기대하고 있다.", hint: { phrase: "looking forward to", meaningKo: "~을 기대하다" } },
  ],

};

const libraryTools: Passage = {
  id: "library-tools",
  title: "A Town Library Starts Lending Tools",
  titleKo: "동네 도서관이 공구를 빌려주기 시작하다",
  category: "Social News",
  level: "Medium",
  minutes: 2,
  available: false,
  paragraphsEn: [],
  paragraphsKo: [],
  vocab: {},
  talk: [],
  expressions: [],
  practice: [],
  write: [],
};

export const passages: Passage[] = [dadVideoCall, libraryTools];

export function getPassage(id: string): Passage | undefined {
  return passages.find((p) => p.id === id);
}
