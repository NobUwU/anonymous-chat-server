const init = async () => {
  await import('./network/rest')
}

init()
  .then(() => console.log("[Network]: Server init successful!"))
  .catch(console.error)
