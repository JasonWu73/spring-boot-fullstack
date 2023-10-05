import React from 'react'
import { Button } from '@/components/ui/Button'

type State = { count: number }

class ClassyWeather extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props)

    this.state = { count: 5 }
  }

  handleDecrement = () => {
    this.setState((prev) => ({ count: prev.count - 1 }))
  }

  handleIncrement = () => {
    this.setState((prev) => ({ count: prev.count + 1 }))
  }

  render() {
    const computedDate = new Date()
    computedDate.setDate(computedDate.getDate() + this.state.count)

    return (
      <div className="mx-auto mt-8 flex w-60 items-center justify-center gap-4 rounded-md border p-4 shadow">
        <Button onClick={this.handleDecrement}>-</Button>
        <span>
          {computedDate.toDateString()} - [{this.state.count}]
        </span>
        <Button onClick={this.handleIncrement}>+</Button>
      </div>
    )
  }
}

export { ClassyWeather }
