import Stripe from 'stripe'

// Cena promocije oglasa — placeholder, prilagodite pred zagonom.
export const PROMOCIJA_CENA_EUR = 19
export const PROMOCIJA_DNI = 30

export function createStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY manjka — dodajte ga v .env, da omogočite plačila.')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}
