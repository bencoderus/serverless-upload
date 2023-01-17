class FileNotFound extends Error {
  static invalidFileName() {
    throw new FileNotFound('File name is invalid or does not exists.');
  }
}

module.exports = FileNotFound;
