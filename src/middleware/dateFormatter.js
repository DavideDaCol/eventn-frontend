export function dateFormatter(date) {
    return new Date(date).toLocaleDateString("it-IT", { day: "numeric", month: "long" });
}

export function timeFormatter(date) {
    return new Date(date).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

export default { dateFormatter, timeFormatter };