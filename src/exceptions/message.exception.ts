export const AuthExceptions = {
    ALREADY_REGISTERED: 'User with this credentials already exists!',
    INVALID_PHONE: 'Invalid phone',
    USER_NOT_VERIFY: 'User is not verify',
    USER_NOT_FOUND: 'User with this credentials not found!',
    USERS_NOT_FOUND: 'Users with this credentials not found!',
    PASSWORD_DOES_NOT_MATCH: `Passwords don't match`,
    WRONG_REFRESH_TOKEN: 'Wrong refresh token',
    WRONG_DATE_OF_BIRTH: 'Incorrect date of birth',
    CODE_IS_VALIDATE: 'Code is valid',
    TOKEN_NOT_FOUND: 'Resresh token not found!',
    TOKEN_FAULT: 'The token was not found or the token is not valid',
    CODE_NOT_CORRECT: 'Проверьте код из сообщения или запросите новый',
    ACCESS_DENIED: 'access denied',
    TIME_HAS_EXPIRED: 'The time for password recovery has expired',
    EMAIL_NOT_CONFIRM: 'You have not confirmed email',
    UNREGISTERED: 'Unregistered',
    SMS_SERVICE_UNAVAILABLE: 'Смс сервис не доступен. Попробуйте позже',
    NOT_FOUND: 'Not found',
    REGISTRATION_REFUSED: 'Registration is prohibited for users under 18',
    PASSCODE_ALREADY_EXISTS:'Код пароль уже установлен'
};

export const UserExceptions = {
    USER_DELETED: 'User deleted',
    USER_HAS_BEEN_DELETED_AFTER_3_MONTH: 'User has been deleted after 3 month',
    USER_CREATED: 'User created successfully!',
    COULD_NOT_DELETE_USER: 'Could not delete user',
    GUARDIAN_WARD_NOT_FOUND: 'Guardian ward relation not found',
    GUARDIAN_WARD_ALREADY_EXISTS: 'Guardian ward relation already exists',
}

export const ClinicExceptions = {
    CLINIC_NOT_FOUND: 'Clinic not found',
}


