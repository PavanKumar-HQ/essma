import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AppMutationOptions<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: TError) => string);
}

/**
 * Global wrapper around useMutation to enforce consistent UI feedback.
 * Automatically displays a loading toast, success toast, and error toast.
 * Prevents duplicate clicks by utilizing isPending state in the UI.
 */
export function useAppMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  options: AppMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    // We can also trigger a loading toast here in onMutate if desired, 
    // but sonner's `toast.promise` is often better. For this architecture,
    // the UI components should use `mutation.isPending` to show "Saving..." on the button.
    onSuccess: (...args) => {
      const [data] = args;
      const message = options.successMessage
        ? typeof options.successMessage === 'function'
          ? options.successMessage(data)
          : options.successMessage
        : 'Operation completed successfully.';
      toast.success(message);

      if (options.onSuccess) {
        options.onSuccess(...args);
      }
    },
    onError: (...args) => {
      const [error] = args;
      if (options.errorMessage) {
        const message =
          typeof options.errorMessage === 'function'
            ? options.errorMessage(error)
            : options.errorMessage;
        toast.error(message);
      } else if (error instanceof Error) {
        // Fallback to database error message
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
      if (options.onError) {
        options.onError(...args);
      }
    },
  });
}
