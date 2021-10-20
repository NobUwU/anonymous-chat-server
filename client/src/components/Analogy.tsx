import React from 'react'

import "./Analogy.scss"

const analogy = [
  "When you say 'Forward' or 'Back', your lips move in those directions.",
  "People who are goodlooking but have terrible personalities are basically real life click baits.",  
  "The Japanese flag could actually be a pie chart of how much of Japan is Japan.",
  "When you clean out a vacuum cleaner, you become a vacuum cleaner.",
  "Beef jerky is basically a meat raisin.",
  "Holes are completely empty, yet wholes are completely full.",
  "Every truck is a food truck if you're a cannibal.",
  `Why do people say "tuna fish" when they don't say "beef mammal" or "chicken bird"?`,
  "Why aren't iPhone chargers called apple juice?",
]

const Analogy: React.FC = () => {
  const [j, cj] = React.useState<string>(analogy[Math.floor(Math.random() * analogy.length)])

  const ref = React.useRef<HTMLDivElement>()
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      ref.current?.classList.add("out")
      setTimeout(() => {
        const cur = analogy.indexOf(j)
        let next = analogy[cur + 1]
        if (!next) next = analogy[0]

        cj(next)
        ref.current?.classList.remove("out")
      }, 1100)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [j])

  return (
    <div id="analogy">
      <p ref={ref}>{j}</p>
    </div>
  )
}

export default Analogy
