import {
  Pr_Ipv4,
  Pr_Ipv4Deconstruct,
} from '@animiru/singularity'
import C from '../Constants'

const singularity = new Pr_Ipv4(C.Epoch)

export function construct(): string {
  return singularity.generate()
}

export function deconstruct(id: string): Pr_Ipv4Deconstruct {
  return singularity.deconstruct(id)
}
