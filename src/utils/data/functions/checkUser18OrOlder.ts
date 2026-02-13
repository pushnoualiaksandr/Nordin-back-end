export function isUser18OrOlder(birthDate: Date): boolean {

    const [year, month, day] = birthDate.toString().split('-').map(Number);
    const birthDateObj = new Date(year, month - 1, day);


    const today = new Date();


    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    const dayDiff = today.getDate() - birthDateObj.getDate();


    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age >= 18;
}