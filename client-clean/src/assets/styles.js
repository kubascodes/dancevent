const baseColor = '#ffbbbb'
const secondary = '#ffd5d5'
const SelectStyle = {
    control: (base, state) => ({
        ...base,
        boxShadow: state.isFocused || state.isSelected ? '0 0 0 0.2rem rgba(255,187,187, 0.25)' : 0,
        borderColor: state.isFocused || state.isSelected
            ? baseColor
            : base.borderColor,
        '&:hover': {
            borderColor: state.isFocused
                ? baseColor
                : base.borderColor,
        }
        
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) =>({
        ...styles,
        backgroundColor: isSelected ? baseColor : isFocused ? secondary : null,



    }),
    multiValue: (base, state) => ({
        ...base,
        background: baseColor,
    })


    

}

export {SelectStyle}