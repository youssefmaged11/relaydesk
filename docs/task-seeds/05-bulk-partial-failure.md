# Task Seed: Partial Bulk Failure

A mixed bulk severity result should roll back only failed records and must not overwrite a newer server update that arrived for a successful record while the batch was pending.
