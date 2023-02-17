import { atom } from 'recoil';
import { LIGHT_THEME } from './const';

export const my_auth = atom({ key: 'my_auth', default: {} });
export const my_tooltip = atom({ key: 'my_tooltip', default: {} });
export const new_toast = atom({ key: 'new_toast', default: null });
export const timer_ticks = atom({ key: 'timer_ticks', default: null });
export const options_open = atom({ key: 'options_open', default: false });
export const light_theme = atom({ key: 'light_theme', default: localStorage.getItem(LIGHT_THEME) });
