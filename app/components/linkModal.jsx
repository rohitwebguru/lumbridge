import React, { useState, useEffect } from 'react';
import { Link } from 'lucide-react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { PlatformLogos } from './platformLogos';
import { useSession } from "next-auth/react";

const Toggle = ({ id, checked, blue, onChange }) => (
  <div className="flex items-center">
    <button
      type="button"
      className={`${blue ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
      role="switch"
      aria-checked={blue}
      onClick={onChange}
    >
      <span
        aria-hidden="true"
        className={`${blue ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

const BusinessManager = [
  { id: 1, name: 'placeholder business manager 1' },
  { id: 2, name: 'placeholder business manager 2' },
  { id: 3, name: 'placeholder business manager 3' },
]

const LinkModal = ({ isOpen, setIsOpen, workspaceLink }) => {
  const { data: session } = useSession();
  var user_email = session?.user.email;
  const [googleExpanded, setGoogleExpanded] = useState([]);
  const [facebookExpanded, setFacebookExpanded] = useState([]);
  const [googleScopes, setGoogleScopes] = useState({});
  const [facebookScopes, setFacebookScopes] = useState({});
  console.log(googleScopes)
  console.log(facebookScopes)
  const google_scope = session?.scope?.google;
  const fb_scope = session?.scope?.facebook;

  const saveScopesToDB = async () => {
    const data = {
      link:workspaceLink,
      googleScopes: Object.values(googleScopes),
      facebookScopes: Object.values(facebookScopes),
      email:user_email
    };

    try {
      const response = await fetch('/api/scopeupdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Scopes saved successfully:', result);
      } else {
        console.error('Failed to save scopes:', result.message);
      }
    } catch (error) {
      console.error('Error saving scopes:', error);
    }
  };

  useEffect(() => {
    saveScopesToDB();
  }, [])
  


  const [selected, setSelected] = useState(BusinessManager[0]); // Changed to index 0 to avoid undefined

  const googlePermissions = [
    { name: 'Google Ads', email: user_email, istrue: google_scope?.['https://www.googleapis.com/auth/adwords'] || false, scope: 'https://www.googleapis.com/auth/adwords' },
    { name: 'Analytics', email: user_email, istrue: google_scope?.['https://www.googleapis.com/auth/analytics'] || false, scope: 'https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.manage.users' },
    { name: 'Tag Manager', email: user_email, istrue: google_scope?.['https://www.googleapis.com/auth/tagmanager.manage.accounts'] || false, scope: 'https://www.googleapis.com/auth/tagmanager.manage.accounts https://www.googleapis.com/auth/tagmanager.edit.containers https://www.googleapis.com/auth/tagmanager.readonly https://www.googleapis.com/auth/tagmanager.manage.users' },
    { name: 'Business Profile', email: user_email, istrue: google_scope?.['https://www.googleapis.com/auth/business.manage'] || false, scope: 'https://www.googleapis.com/auth/business.manage' },
    { name: 'Google Search Console', email: user_email, istrue: google_scope?.['https://www.googleapis.com/auth/webmasters'] || false, scope: 'https://www.googleapis.com/auth/webmasters' }
  ];

  const facebookPermissions = [
    { name: 'Ad Account', email: user_email, istrue: fb_scope?.['pages_manage_posts'], scope: 'pages_manage_posts' },
    { name: 'Facebook Page', email: user_email, istrue: fb_scope?.['pages_show_list'], scope: 'pages_show_list' },
    { name: 'Instagram Page', email: user_email, istrue: fb_scope?.['instagram_basic'], scope: 'instagram_basic pages_read_engagement' },
    { name: 'Pixel', email: user_email, istrue: fb_scope?.['ads_management'], scope: 'ads_management business_management read_insights pages_manage_engagement' },
    { name: 'Catalog', email: user_email, istrue: fb_scope?.['catalog_management'], scope: 'catalog_management' },
  ];

  const [isBlue, setBlue] = useState(false);
  // const chnageblue = ()
  const PermissionItem = ({ name, email, scope, onToggle }) => {
    const [isChecked, setIsChecked] = useState(false);
    const handleChange = () => {
      const newChecked = !isChecked;
      setIsChecked(!isChecked);
      setBlue(!isBlue);
      onToggle(scope);
    };
    useEffect(() => {
      console.log(isBlue);
    }, [isBlue])


    return (
      <div className="flex items-center space-x-4 py-2">
        <Toggle
          id={`${name}-toggle`}
          checked={isChecked}
          blue={isBlue}
          onChange={handleChange}
        />
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>

        </div>
        <div className="flex-grow">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
        <button className="text-blue-500 text-xs">change</button>
      </div>
    );
  };

  const handleGoogleToggle = (scope, isChecked) => {
    setGoogleScopes((prev) => ({
      ...prev,
      [scope]: scope,
    }));
  };

  const handleFacebookToggle = (scope, isChecked) => {
    const scopes = scope.split(' ');
    const newScopes = scopes.reduce((acc, s) => {
      acc[s] = scope;
      return acc;
    }, {});
    setFacebookScopes((prev) => ({
      ...prev,
      ...newScopes,
    }));
  };


  const handleSave = () => {
    const dataToSend = {
      scope: {
        google: {
          ...googleScopes,
        },
        facebook: {
          ...facebookScopes,
        },
      },
    };
    console.log(dataToSend);
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Implement cancel functionality here
    console.log('Cancelling changes...');
    setIsOpen(false);
  };

  const handleCopyLink = () => {
    // Implement copy link functionality here
    console.log('Copying link...');
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} as="div" className="relative z-50">
      <DialogBackdrop
        as="div"
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity z-40"
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center text-center">
          <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all space-y-4">
            <DialogTitle as="h2" className="text-xl font-semibold text-gray-800">
              Customize your access link permissions
            </DialogTitle>
            <p className="text-gray-600 text-sm">
              Select which accounts to get access to by default.
              You can also create custom requests to receive access to specific assets.
            </p>

            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-50"
                  onClick={() => setGoogleExpanded(!googleExpanded)}
                >
                  <div className="flex items-center space-x-2">
                  <PlatformLogos.Google />
                    <span className="font-medium text-gray-900">Google Accounts</span>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ease-in-out ${googleExpanded ? 'transform rotate-180' : ''
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${googleExpanded ? 'max-h-96' : 'max-h-0'
                    }`}
                >
                  <div className="p-4 space-y-2 text-gray-900">
                    {googlePermissions.map((perm, index) => (
                      <PermissionItem key={index} {...perm} onToggle={handleGoogleToggle} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-50"
                  onClick={() => setFacebookExpanded(!facebookExpanded)}
                >
                  <div className="flex items-center space-x-2">
                    <PlatformLogos.Facebook />
                    <span className="font-medium text-gray-900">Facebook Accounts</span>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ease-in-out ${facebookExpanded ? 'transform rotate-180' : ''
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${facebookExpanded ? 'max-h-96' : 'max-h-0'
                    }`}
                >
                  <div className="p-4 space-y-2 text-gray-900">

                  <Listbox value={selected} onChange={setSelected}>
                    <Label className="block text-sm font-medium leading-6 text-gray-900">Facebook Business Manager | <a className='text-blue-400 hover:underline' href='#'>Reconnect</a></Label>
                    <div className="relative mt-2">
                      <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <span className="block truncate">{selected ? selected.name : 'Select an option'}</span> {/* Added fallback */}
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                        </span>
                      </ListboxButton>

                      <ListboxOptions
                        transition
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-0.5 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                      >
                        {BusinessManager.map((person) => (
                          <ListboxOption
                            key={person.id}
                            value={person}
                            className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-blue-600 data-[focus]:text-white"
                          >
                            <span className="block truncate font-normal group-data-[selected]:font-semibold">{person.name}</span>

                            <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                              <CheckIcon aria-hidden="true" className="h-5 w-5" />
                            </span>
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>

                    {facebookPermissions.map((perm, index) => (
                      <PermissionItem key={index} {...perm} onToggle={handleFacebookToggle} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handleCopyLink}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Link className="w-4 h-4 mr-2" />
                Copy Link
              </button>
              <div className="space-x-4">
                <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                  Cancel
                </button>
                <button onClick={saveScopesToDB} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                  Save Changes
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default LinkModal;