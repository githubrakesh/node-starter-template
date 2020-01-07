import {Dictionary} from "async";
import uuidv4 from "uuid";
import {isUndefined} from "util";
import * as _ from "lodash";

export class Helpers {
  public static generateRandomString(length = 8, options: {
    start?: string
    includeUpperCase: boolean,
    includeLowerCase: boolean,
    includeNumbers: boolean
    includeSpecialCharacters?: boolean
  }) {
    let text = options.start || "";

    const startLength = text.length;
    const remainingLength = length - text.length;

    if (remainingLength <= 0) {
      // Original String is already
      // greater than required length
      return text;
    }

    let dictionary = "";

    if (options.includeLowerCase) {
      dictionary += "abcdefghijklmnopqrstuvwxyz";
    }

    if (options.includeUpperCase) {
      dictionary += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if (options.includeNumbers) {
      dictionary += "1234567890";
    }

    if (options.includeSpecialCharacters) {
      dictionary += "!@#$%^&*()";
    }

    for (let i = 1; i < length; i++) {
      text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    }

    return text;
  }

  public static generateRandomNumber(max: number, min?: number) {
    const effectiveMin = min || 0;

    const _window = max - min;

    if (_window <= 0) {
      throw "PARAMS_ERROR";
    }

    return min + Math.floor(Math.random() * _window);
  }

  public static generateUUIDV4(): string {
    return uuidv4();
  }

  public static sanitizeString(subject: string): string {
    const asciiPart = subject.replace(/[^\x00-\x7F]/g, "");
    const withoutSpaces = asciiPart.replace(" ", "_");
    return withoutSpaces.toLowerCase();
  }

  public static sleep(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  /**
   * Ideally, the parameter type any should be replaced by typeof T but the compiler (TS 2.4) can"t understand this syntax.
   * @param enumRef
   * @returns {T[]}
   */
  public static iterateEnum<T>(enumRef: any): T[] {
    return Object.keys(enumRef).map(key => enumRef[key]);
  }

  public static checkInEnum<T>(enumRef: any, value: T): boolean {
    return Object.keys(enumRef)
      .filter(k => isNaN(Number(k))) // Removing reverse mapping in numeric enums.
      .filter(k => enumRef[k] === value).length > 0;
  }

  public static inflate<T>(object: T, params: Dictionary<any>): T {
    return <T>Object.assign(object, params);
  }

  public static removeUndefinedKeys(object: any) {
    Object.keys(object).forEach(key => {
      if (isUndefined(object[key])) {
        delete object[key];
      }
    });
  }

  public static epochInMillis(expireAt: any) {
    return expireAt instanceof Date ? expireAt.getTime() : expireAt;
  }
}
