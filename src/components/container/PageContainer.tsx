type Props = {
  children: any | JSX.Element | JSX.Element[];
  classStyle?: any;
};

const PageContainer = ({ children, classStyle }: Props) => <div className={`pt-[24px] ${classStyle}`}>{children}</div>;

export default PageContainer;
