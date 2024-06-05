import { Match } from 'navigo';

export type MatchFunc = (match: Match) => void;

export type SearchParams = Record<string, string> | null;
