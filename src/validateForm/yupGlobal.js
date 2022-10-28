import * as yup from 'yup'

const REGEX_PASSWORD= /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
const REGEX_ONLY_NUMBER= /^\d+$/

yup.addMethod(yup.string, 'password', function (
  message,
) {
  return this.matches(REGEX_PASSWORD, {
    message,
    excludeEmptyString: true,
  })
})

yup.addMethod(yup.string, 'onlyNumber', function (
  message,
) {
  return this.matches(REGEX_ONLY_NUMBER, {
    message,
    excludeEmptyString: true,
  })
})
export default yup