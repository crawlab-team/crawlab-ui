export const isChineseName = (user: User) => {
  return /[\u4e00-\u9fa5]/.test(
    (user.first_name || '') + (user.last_name || '')
  );
};

export const getUserFullName = (user: User) => {
  const firstName = user.first_name || '';
  const lastName = user.last_name || '';
  if (isChineseName(user)) {
    return lastName + firstName;
  } else {
    return (firstName + ' ' + lastName).trim();
  }
};

export const getUserShortName = (user: User) => {
  // Get first and last name
  const firstName = user.first_name || '';
  const lastName = user.last_name || '';

  // Fallback to username if no name provided
  if (!firstName && !lastName) {
    return user.username || '';
  }

  // If Chinese name, return at most 4 characters
  if (isChineseName(user)) {
    return getUserFullName(user).slice(0, 4);
  }

  // Otherwise, return first initial and last initial
  const firstInitial = firstName ? firstName[0].toUpperCase() : '';
  const lastInitial = lastName ? lastName[0].toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};
