import { MIN_BET, MAX_BET, BET_STEP, MULTIPLIERS, RESULTS } from "./data";

// Trả về câu báo lỗi, hoặc chuỗi rỗng nếu mức cược hợp lệ
export const validateBet = (bet, score) => {
  const valid =
    Number.isInteger(bet) &&
    bet % BET_STEP === 0 &&
    bet >= MIN_BET &&
    bet <= MAX_BET &&
    bet <= score;
  return valid
    ? ""
    : `Mức cược phải là bội số của ${BET_STEP}, từ ${MIN_BET} đến ${MAX_BET} và không vượt quá số điểm đang có`;
};

// Đúng: cộng mức cược × hệ số. Sai hoặc hết giờ: trừ đúng mức cược
export const calcChange = (bet, level, correct) =>
  correct ? Math.round(bet * MULTIPLIERS[level]) : -bet;

// Mục đầu tiên trong RESULTS có điểm >= min
export const getResult = (score) => RESULTS.find(({ min }) => score >= min);