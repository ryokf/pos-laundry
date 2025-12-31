// Validation utility functions

export function validateRequired(value: string): boolean {
    return value.trim().length > 0;
}

export function validatePhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 13;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePositiveNumber(value: number): boolean {
    return !isNaN(value) && value > 0;
}

export function validateMinValue(value: number, min: number): boolean {
    return !isNaN(value) && value >= min;
}
