'use strict';

/**
 * Configuration manager
 *
 * @constructor
 */
export class ConfigurationManager {
  /**
   * Creates new configuration
   *
   * @returns Configuration
   */
  public createNewConfiguration(): INewConfiguration {
    return {
      _globalConfiguration: {},
      _environmentConfiguration: {},
      _additionalConfigurations: [],
    } as any;
  }

  /**
   * Adds environment specific configuration
   *
   * @param currentConfiguration
   * @param environment
   * @param environmentConfiguration
   */
  public addEnvironmentConfiguration(
    currentConfiguration: any,
    environment: string,
    environmentConfiguration: any,
  ): void {
    if (typeof environmentConfiguration === 'object') {
      currentConfiguration._environmentConfiguration[environment] =
        environmentConfiguration;
    }
  }

  /**
   * Sets global configuration
   *
   * @param currentConfiguration
   * @param globalConfiguration
   */
  public setGlobalConfiguration(
    currentConfiguration: any,
    globalConfiguration: any,
  ): void {
    if (typeof globalConfiguration === 'object') {
      currentConfiguration._globalConfiguration = globalConfiguration;
    }
  }

  /**
   * Removes all configuration properties
   *
   * @param currentConfiguration
   */
  public resetConfiguration(currentConfiguration: any): void {
    Object.keys(currentConfiguration).forEach((key) => {
      if (
        [
          '_environmentConfiguration',
          '_additionalConfigurations',
          '_globalConfiguration',
        ].indexOf(key) === -1
      ) {
        delete currentConfiguration[key];
      }
    });
  }

  /**
   * Loads global configuration
   *
   * @param currentConfiguration
   */
  public loadGlobal(currentConfiguration: any): void {
    this.resetConfiguration(currentConfiguration);
    this.mergeObjects(
      currentConfiguration,
      currentConfiguration._globalConfiguration,
    );
  }

  /**
   * Load global, then environment configuration
   *
   * @param currentConfiguration
   * @param environment
   */
  public loadEnvironment(currentConfiguration: any, environment: string): void {
    this.resetConfiguration(currentConfiguration);
    this.mergeObjects(
      currentConfiguration,
      currentConfiguration._globalConfiguration,
    );
    this.mergeObjects(
      currentConfiguration,
      currentConfiguration._environmentConfiguration[environment],
    );
    currentConfiguration.env = environment;
  }

  /**
   * Loads all previously applied additional configuration
   *
   * @param currentConfiguration
   */
  public reloadAdditionalConfiguration(currentConfiguration: any): void {
    for (const i in currentConfiguration._additionalConfigurations) {
      if (
        Object.prototype.hasOwnProperty.call(
          currentConfiguration._additionalConfigurations,
          i,
        )
      ) {
        this.mergeObjects(
          currentConfiguration,
          currentConfiguration._additionalConfigurations[i],
        );
      }
    }
  }

  /**
   * Applies (and adds to "cache") additional configuration
   *
   * @param currentConfiguration
   * @param additionalConfiguration
   */
  public applyConfiguration(
    currentConfiguration: any,
    additionalConfiguration: any,
  ): void {
    if (typeof additionalConfiguration === 'object') {
      currentConfiguration._additionalConfigurations.push(
        additionalConfiguration,
      );
      this.mergeObjects(currentConfiguration, additionalConfiguration);
    }
  }

  /**
   * Merge two objects
   *
   * @param target
   * @param src
   *
   * @returns {boolean|Array|*}
   */
  private mergeObjects(target: any, src: any): boolean | Array<any> | unknown {
    const array = Array.isArray(src);
    const dst = (array && []) || target;

    if (target && typeof target === 'object') {
      Object.keys(target).forEach((key) => {
        dst[key] = target[key];
      });
    }
    Object.keys(src).forEach((key) => {
      if (typeof src[key] !== 'object' || !src[key]) {
        dst[key] = src[key];
      } else {
        if (!target[key]) {
          dst[key] = src[key];
        } else {
          dst[key] = this.mergeObjects(target[key], src[key]);
        }
      }
    });

    return dst;
  }
}

export interface INewConfiguration {
  _globalConfiguration: Record<string, any>;
  _environmentConfiguration: Record<string, any>;
  _additionalConfigurations: Array<any>;
  env?: 'dev' | 'prod' | 'staging' | 'store';
  [key: string]: any;
}
