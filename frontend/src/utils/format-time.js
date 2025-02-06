export function formatTime(time) {
    const days = Math.floor(time / (24 * 60 * 60))
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((time % (60 * 60)) / 60)
    const seconds = time % 60

    return {
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
    }
}
