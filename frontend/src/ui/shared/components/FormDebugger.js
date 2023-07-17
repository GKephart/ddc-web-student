import React from 'react'

export const FormDebugger = props => (
  <div style={{ margin: '1rem 0' }}>
    <h3 style={{ fontFamily: 'monospace' }}>.</h3>
    <pre
      style={{
        background: '#a3b7b7',
        fontSize: '.65rem',
        padding: '.5rem'
      }}
    >
      <strong>props</strong> ={' '}
      {JSON.stringify(props, null, 2)}
    </pre>
  </div>
)
