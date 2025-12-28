/**
 * @param date - Date 객체
 * @description 날짜를 'YYYY.MM.DD' 형식의 문자열로 변환
 * @returns
 */
export const getYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
