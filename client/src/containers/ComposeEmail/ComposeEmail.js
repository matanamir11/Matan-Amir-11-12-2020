import React from 'react';
import './ComposeEmail.scss';
import CreateEmail from '../../components/CreateEmail/CreateEmail';

const ComposeEmail = () => {
  return (
    <div className='compose-email'>
      <CreateEmail />
    </div>
  );
};

export default ComposeEmail;
