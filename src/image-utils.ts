function getDataURL(file: File) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export function getDataURLs(files: File[]) {
  return Promise.all(files.map(getDataURL));
}
