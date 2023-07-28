export function getUserInitials(name: string) {
  const splitName = name.toUpperCase().split(' ');
  if (splitName.length === 1) {
    return splitName[0] ? splitName[0].charAt(0) : '';
  } else {
    let initials = '';
    for (let i = 0; i < 2; i++) {
      if (splitName[i]) {
        initials += splitName[i].charAt(0);
      }
    }
    return initials;
  }
}
