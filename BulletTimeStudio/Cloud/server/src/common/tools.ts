
class Tools {

  isEmptyArray(array: Array<any>) {
    return array.length === 0
  }
  isValidArray(array: Array<any>) {
    return this.isEmptyArray(array) ? false : array
  }
}
const tools = new Tools();
export default tools;