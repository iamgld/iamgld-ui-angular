describe('browser smoke', () => {
  test('Given browser mode is enabled, When this spec runs, Then DOM APIs are available', () => {
    expect(window).toBeDefined()
    expect(document.body).toBeDefined()
  })
})
