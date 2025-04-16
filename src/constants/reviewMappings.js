export const REVIEW_MAPPINGS = {
  fatigue_level: {
    5: "Nhiều năng lượng",
    4: "Năng lượng",
    3: "Bình thường",
    2: "Mệt mỏi hơn bình thường",
    1: "Luôn cảm thấy mệt mỏi"
  },
  sleeping_quality: {
    5: "Rất tốt",
    4: "Tốt",
    3: "Khó vào giấc",
    2: "Ngủ không sâu",
    1: "Mất ngủ"
  },
  muscle_soreness: {
    5: "Cảm giác tốt",
    4: "Cảm giác ổn",
    3: "Bình thường",
    2: "Căng mỏi nhẹ",
    1: "Rất căng mỏi (đau)"
  },
  stress_level: {
    5: "Rất thư giãn",
    4: "Thư giãn",
    3: "Bình thường",
    2: "Cảm giác hơi stress",
    1: "Rất stress"
  },
  mental_state: {
    5: "Rất phấn chấn",
    4: "Cảm thấy ổn",
    3: "Ít hứng thú tập luyện",
    2: "Dễ khó chịu với mọi người",
    1: "Rất khó chịu với mọi người"
  }
};

export const REQUIRED_FIELDS = [
  'muscle_soreness_point',
  'sleep_hours',
  'fatigue_level',
  'sleeping_quality',
  'muscle_soreness',
  'stress_level',
  'mental_state'
]; 