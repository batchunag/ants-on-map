import React from 'react'

export interface Person {
  name: string
}

function Runners(props: { runners: Person[] }) {
  const { runners } = props
  return (
    <div>
      Runners
      {runners.map((person) => {
        // Return the element. Also pass key
        return <div key={person.name}>{person.name}</div>
      })}
    </div>
  )
}

export default Runners
