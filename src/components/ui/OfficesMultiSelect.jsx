// src/components/OfficesMultiSelect.jsx
import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

/**
 * OfficesMultiSelect
 *
 * Props:
 * - offices: Array<{ id: number|string, name: string, address: string }>
 * - selected: Array<number|string>              ← IDs seleccionados
 * - onChange: (selectedIds: Array<number|string>) => void
 */
export default function OfficesMultiSelect({ offices, selected, onChange }) {
  // Mapear offices a opciones de react-select
  const options = offices.map((office) => ({
    value: office.id,
    label: office.name,
  }))

  // Mapear selected IDs a opciones
  const defaultValue = options.filter((opt) =>
    selected.includes(opt.value)
  )

  // Handler de react-select
  const handleChange = (selectedOptions) => {
    // selectedOptions es null | Array< { value, label } >
    const values = selectedOptions
      ? selectedOptions.map((opt) => opt.value)
      : []
    onChange(values)
  }

  return (
    <Select
      isMulti
      name="offices"
      options={options}
      value={defaultValue}
      onChange={handleChange}
      className="offices-multi-select"
      classNamePrefix="select"
      placeholder="Selecciona oficinas..."
      closeMenuOnSelect={false}
    />
  )
}

OfficesMultiSelect.propTypes = {
  offices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
  selected: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  onChange: PropTypes.func.isRequired,
}

OfficesMultiSelect.defaultProps = {
  selected: [],
}
