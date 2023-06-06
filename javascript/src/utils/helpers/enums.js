export const dropdownOptions = [
  {value: 'day', label: 'Daily Basis', className: 'myOptionClassName'},
  {value: 'week', label: 'Weekly Basis', className: 'myOptionClassName'},
  {value: 'month', label: 'Monthly Basis'},
  {value: 'year', label: 'Yearly Basis'},
]

export const StatusEnumeration = {
  'A': 'Active',
  'GP': 'Grace Period',
  'O': 'Other'
}

export const options_group_by = [
  {value: 'year', label: 'yearly'},
  {value: 'month', label: 'monthly'},
  {value: 'week', label: 'weekly'},
];

export const options = {
  year: {
    title: "Number of Communities created per year",
    hAxis: {
      format: 'Y',
    },
    count_interval: 12
  },
  month: {
    title: "Number of Communities created per month",
    hAxis: {
      format: 'YYYY-MM',
    },
    count_interval: 24
  },
  week: {
    title: "Number of Communities created per week",
    hAxis: {
      format: '',
    },
    count_interval: 24
  }
}

export const regUsersOptions = {
  year: {
    title: "Number of Registered Users per year",
    hAxis: {
      format: 'Y',
    },
    count_interval: 8
  },
  month: {
    title: "Number of Registered Users per month",
    hAxis: {
      format: 'YYYY-MM',
    },
    count_interval: 8
  },
  week: {
    title: "Number of Registered Users per week",
    hAxis: {
      format: '',
    },
    count_interval: 8
  }
};
