module.exports = (finalScore, conduct) => {
    const sGood = finalScore >= 8
    const sMedium = finalScore >= 6.5 && finalScore < 8
    const sBad = finalScore >= 5 && finalScore < 6.5
    const sVeryBad = finalScore < 5

    const cGood = conduct === "Tốt"
    const cMedium = conduct === "Khá"
    const cBad = conduct === "Trung bình"
    const cVeryBad = conduct === "Yếu"

    if (sGood && cGood) return "Giỏi"
    if (sGood && cMedium) return "Giỏi"
    if (sGood && cBad) return "Tiên tiến"
    if (sGood && cVeryBad) return "Tiên tiến"

    if (sMedium && !cVeryBad) return "Tiên tiến"
    if (sMedium && cVeryBad) return "Trung bình"

    if (sBad && !cVeryBad) return "Trung bình"
    if (sBad && cVeryBad) return "Yếu"

    if (sVeryBad) return "Yếu"
}
