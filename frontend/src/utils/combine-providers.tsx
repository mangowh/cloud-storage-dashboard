import { ComponentType, FC, PropsWithChildren, ReactNode } from "react";

type ProviderEntry<P extends object> = [ComponentType<PropsWithChildren<P>>, P];

type CombinedProvidersProps = { children?: ReactNode };

export function combineProviders<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Entries extends readonly ProviderEntry<any>[]
>(providers: Entries): FC<CombinedProvidersProps> {
  return providers.reduce<FC<CombinedProvidersProps>>(
    (AccumulatedProviders, [Provider, props]) => {
      const Combined: FC<CombinedProvidersProps> = ({ children }) => (
        <AccumulatedProviders>
          <Provider {...props}>{children}</Provider>
        </AccumulatedProviders>
      );
      return Combined;
    },
    ({ children }) => <>{children}</>
  );
}
