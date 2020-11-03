import { InjectionToken } from '@angular/core';

import { Random } from '../random/random.type';
import { RandomStringGenerator } from './random-string-generator.type';

/**
 * @description
 *
 * Generates a code verifier of 43 characters.
 *
 */
export class DefaultCodeVerifierGenerator implements RandomStringGenerator
{
    // Specified in https://tools.ietf.org/html/rfc7636#section-4.1
    private readonly allowedCharacters = '-._~0123456789ABCEDFGHIJKLMNOPQRSTUVWXYZabcdefghijlkmnopqrstuvwxyz';

    /**
     * Constructs new instance with given random number generator function.
     */
    constructor(private readonly random: Random) {}

    /**
     * Generates a code verifier.
     */
    public generate(): string
    {
        let codeVerifier = '';
        for (let i = 0; i < 43; i++) {
            codeVerifier += this.allowedCharacters.charAt(this.random() * this.allowedCharacters.length);
        }
        return codeVerifier;
    }
}

export const DEFAULT_CODEVERIFIER_GENERATOR = new InjectionToken<RandomStringGenerator>('default code-verifier generator');
