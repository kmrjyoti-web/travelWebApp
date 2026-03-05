'use client';
/**
 * CitySearch — typeahead input for city selection.
 * Fetches from /api/world/cities/search with 300 ms debounce.
 * Integrates with react-hook-form via Controller (controlled pattern).
 *
 * Usage:
 *   <Controller name="from" control={control} render={({ field }) => (
 *     <CitySearch
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       icon="MapPin"
 *       floatingLabel="From (Origin City)"
 *       errorMessage={errors.from?.message}
 *     />
 *   )} />
 */
import React, { useState, useRef, useEffect, useId } from 'react';
import { CFormInput, CFormFeedback } from '@coreui/react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useSearchCities } from '@/shared/hooks/useWorld';
import type { City } from '@/shared/types/world.types';

/** Convert ISO 3166-1 alpha-2 country code to flag emoji. */
function getFlagEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

export interface CitySearchProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  floatingLabel?: string;
  icon?: IconName;
  errorMessage?: string;
  /** Optionally restrict results to a country ISO2 code */
  countryFilter?: string;
  disabled?: boolean;
}

export function CitySearch({
  value,
  onChange,
  onBlur,
  floatingLabel,
  icon,
  errorMessage,
  countryFilter,
  disabled,
}: CitySearchProps) {
  const listboxId = useId();
  const [inputText, setInputText] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedQ = useDebounce(inputText, 300);
  const { data: cities = [], isFetching } = useSearchCities(debouncedQ, countryFilter);

  // Sync when external value changes (e.g. form reset)
  useEffect(() => {
    setInputText(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setInputText(text);
    onChange(text);
    setIsOpen(text.length >= 2);
    setActiveIndex(-1);
  }

  function handleSelect(city: City) {
    const label = city.stateCode
      ? `${city.name}, ${city.stateCode}, ${city.countryIso2}`
      : `${city.name}, ${city.countryIso2}`;
    setInputText(label);
    onChange(label);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || cities.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, cities.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(cities[activeIndex]!);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  const inputEl = (
    <CFormInput
      value={inputText}
      onChange={handleInputChange}
      onBlur={() => { onBlur?.(); }}
      onFocus={() => { if (inputText.length >= 2) setIsOpen(true); }}
      onKeyDown={handleKeyDown}
      invalid={!!errorMessage}
      floatingLabel={floatingLabel}
      placeholder={floatingLabel ? ' ' : undefined}
      autoComplete="off"
      role="combobox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-autocomplete="list"
      aria-activedescendant={activeIndex >= 0 ? `city-opt-${activeIndex}` : undefined}
      disabled={disabled}
    />
  );

  // Show dropdown when: fetching, has results, OR debounced query is long enough with no results
  const hasQuery = debouncedQ.length >= 2;
  const showDropdown = isOpen && hasQuery && (isFetching || cities.length > 0 || (!isFetching && hasQuery));

  return (
    <div
      className={`tos-city-search tos-icon-field tos-input--outlined${errorMessage ? ' tos-city-search--invalid' : ''}`}
      ref={wrapperRef}
    >
      {icon && (
        <span className="tos-icon-field__icon" aria-hidden="true">
          <Icon name={icon} size={16} />
        </span>
      )}
      <div className="tos-icon-field__input tos-city-search__wrap">
        {inputEl}
        {errorMessage && <CFormFeedback invalid>{errorMessage}</CFormFeedback>}

        {showDropdown && (
          <ul
            id={listboxId}
            className="tos-city-search__dropdown"
            role="listbox"
            aria-label={floatingLabel}
          >
            {isFetching && (
              <li className="tos-city-search__item tos-city-search__item--loading" aria-live="polite">
                <span className="tos-city-search__spinner" aria-hidden="true" />
                Searching cities…
              </li>
            )}
            {!isFetching && cities.length === 0 && (
              <li className="tos-city-search__item tos-city-search__item--empty">
                <Icon name="SearchX" size={16} aria-hidden />
                <span>No results for &ldquo;{debouncedQ}&rdquo;</span>
              </li>
            )}
            {!isFetching && cities.map((city, idx) => {
              const meta = [city.stateCode, city.countryIso2].filter(Boolean).join(' · ');
              return (
                <li
                  key={city.id}
                  id={`city-opt-${idx}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  className={`tos-city-search__item${idx === activeIndex ? ' tos-city-search__item--active' : ''}`}
                  onMouseDown={() => handleSelect(city)}
                >
                  <span className="tos-city-search__flag" aria-hidden="true">
                    {getFlagEmoji(city.countryIso2)}
                  </span>
                  <span className="tos-city-search__info">
                    <span className="tos-city-search__name">
                      {city.name}
                      {(city.isCapital || city.isCountryCapital) && (
                        <span className="tos-city-search__badge">Capital</span>
                      )}
                    </span>
                    <span className="tos-city-search__meta">{meta}</span>
                  </span>
                  <span className="tos-city-search__pin" aria-hidden="true">
                    <Icon name="MapPin" size={12} />
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
