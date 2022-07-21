const validateEmail = require("../utils/validate-email")

describe("Email format validation", () => {
    test("Returns false if format is wrong", () => {
        let email = "x@xxxx.t"
        let result = validateEmail(email)
        expect(result).toBeFalsy()
    })
  test("Returns false if only letters", () => {
    let email = "herljdZLXnddasda";
    let result = validateEmail(email);
    expect(result).toBeFalsy();
  });
  test("Returns false if only numbers", () => {
    let email = "123123123123";
    let result = validateEmail(email);
    expect(result).toBeFalsy();
  });
    test("Returns true if format follows regex provided", () => {
      let email = "xx@xxxx.ca";
      let result = validateEmail(email);
      expect(result).toBeTruthy();
    });
})