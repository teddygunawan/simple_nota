import React, { useState } from 'react';

function ProductInput(props) {
  return (
    <div>
      <div className="field">
        <div className="control">
          <input className="input is-primary" type="text" placeholder="Primary input" value={props.value} onChange={e => props.setValue(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export default ProductInput;
