import {
  ButtonProps as BaseButtonProps,
  Button as ButtonBase
} from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { forwardRef, ReactNode } from 'react';

export type ButtonProps = BaseButtonProps & {
  loading?: boolean;
  icon?: ReactNode;
  children: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, icon, children, disabled, ...props }, ref) => {
    const defaultProps = {
      type: 'button',
      size: 'sm',
      ...props
    } as Omit<ButtonProps, 'children'>;

    if (loading) {
      return (
        <ButtonBase {...defaultProps} ref={ref} disabled={disabled || loading}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </ButtonBase>
      );
    }

    return (
      <ButtonBase {...defaultProps} ref={ref} disabled={disabled || loading}>
        {icon ? (
          <div className="flex items-center gap-1">
            {icon}
            {children}
          </div>
        ) : (
          children
        )}
      </ButtonBase>
    );
  }
);
Button.displayName = 'Button';
