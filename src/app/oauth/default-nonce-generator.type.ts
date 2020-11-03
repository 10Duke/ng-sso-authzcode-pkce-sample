import { InjectionToken } from '@angular/core';

import { Random } from '../random/random.type';
import { RandomStringGenerator } from './random-string-generator.type';

/**
 * @description
 *
 * Generates a nonce of 16 characters.
 *
 */
export class DefaultNonceGenerator implements RandomStringGenerator
{
    private readonly nonceCharacters = '!"#%&/()=?+-_<>:;.,*0123456789ABCEDFGHIJKLMNOPQRSTUVWXYZabcdefghijlkmnopqrstuvwxyz';

    /**
     * Constructs new instance with given random number generator function.
     */
    constructor(private readonly random: Random) {}

    /**
     * Generates a nonce.
     */
    public generate(): string
    {
        let nonce = '';
        for (let i = 0; i < 16; i++) {
            nonce += this.nonceCharacters.charAt(this.random() * this.nonceCharacters.length);
        }
        return nonce;
    }
}

export const DEFAULT_NONCE_GENERATOR = new InjectionToken<RandomStringGenerator>('default nonce generator');
