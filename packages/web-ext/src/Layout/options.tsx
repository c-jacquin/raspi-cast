import React, {
  useCallback,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react';

interface OptionsState extends Record<string, any> {
  castIp?: string;
}

const OptionsLayout: React.SFC<{}> = () => {
  const [state, setState] = useState<OptionsState>({});
  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setState({
      [evt.target.name]: evt.target.value,
    });
  }, []);

  const handleSubmit = useCallback(
    async (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      if (state) {
        browser.storage.local.set(state);
        browser.notifications.create('success', {
          title: 'Raspi cast',
          message: 'options saved !',
          type: 'basic',
          iconUrl: browser.extension.getURL('icons/ic_cast_3x.png'),
        });
      }
    },
    [state],
  );

  useEffect(() => {
    browser.storage.local.get('castIp').then(({ castIp }: any) => {
      castIp && setState({ castIp });
    });
  }, []);

  return (
    <div>
      <h1>Options</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="castIp"
          value={state.castIp}
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default OptionsLayout;
