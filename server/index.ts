import { storeTask } from './store'

const init = async () => {
  await storeTask()
  await import('./network/rest')
}

init()
  .then(() => console.log("[Network]: Server init successful!"))
  .catch(console.error)
