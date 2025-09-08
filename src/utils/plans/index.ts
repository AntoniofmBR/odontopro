export type PlansDetailsProps = {
  maxServices: number
}

export type PlanProps = {
  BASIC: PlansDetailsProps,
  PROFESSIONAL: PlansDetailsProps,
}

export const PLANS: PlanProps = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
    maxServices: 50,
  },
}

export const subscriptionPlans = [
  {
    id: 'BASIC',
    name: 'Basic',
    description: 'Perfect for small clinics',
    oldPrice: 'R$ 97,90',
    price: 'R$ 27,90',
    features: [
      `Until ${ PLANS['BASIC'].maxServices } services`,
      `Agendamentos ilimitados`,
      `Support`,
      `Reports`,
    ],
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    description: 'Perfect for big clinics',
    oldPrice: 'R$ 197,90',
    price: 'R$ 97,90',
    features: [
      `Until ${ PLANS['PROFESSIONAL'].maxServices } services`,
      `Agendamentos ilimitados`,
      `Priority Support`,
      `Advanced Reports`,
    ],
  },
]