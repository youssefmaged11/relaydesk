import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { backend } from '../src/api/backend';
import { scheduler } from '../src/api/scheduler';
beforeEach(() => { scheduler.reset(); backend.reset(); localStorage.clear(); });
afterEach(cleanup);
