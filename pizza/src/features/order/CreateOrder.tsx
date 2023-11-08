import { Form, useActionData, useNavigation } from 'react-router-dom'

const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15
  }
]

function CreateOrder() {
  const cart = fakeCart

  const navigation = useNavigation()
  const submitting = navigation.state === 'submitting'

  const actionData = useActionData() as Record<string, string>

  return (
    <div className="max-w-md rounded-sm border p-4 shadow-md">
      <h2>Ready to order? Let's go!</h2>

      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>

          {actionData?.phone && <p>{actionData.phone}</p>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        </div>

        <div>
          <button
            className="rounded bg-sky-500 px-2 py-1 text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Order now'}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default CreateOrder
