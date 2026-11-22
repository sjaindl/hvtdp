import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MysqlService } from '../app/services/mysql.service';
import { StatisticsService } from '../app/services/statistics.service';

/**
 * Providers the components get from AppModule in the real app. HTTP requests go to the testing backend,
 * so specs never call the live API.
 */
export function provideTestDependencies(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    provideNoopAnimations(),
    MysqlService,
    StatisticsService,
    CookieService,
  ];
}
