import { HashMap } from "tstl/container/HashMap";

export class Dictionary<T> extends HashMap<string, T>
{
    /**
     * @inheritDoc
     */
    public toJSON(): any
    {
        return super.toJSON();
    }
}