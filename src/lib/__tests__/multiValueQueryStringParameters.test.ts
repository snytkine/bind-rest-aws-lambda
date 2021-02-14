import multiValueQueryStringParameters from "../stringifyMultiValueQuery";


describe('Test for multiValueQueryStringParameters', () => {
  it('Should convert multiValueQueryString object into a string', () => {

    const input = {
      "aParams": [
        "one",
        "two"
      ],
        "param1": [
        "good"
      ],
        "param2": [
        "bad"
      ]
    }

    const res = multiValueQueryStringParameters(input);
    expect(res).toEqual('aParams=one&aParams=two&param1=good&param2=bad')
  })
})
